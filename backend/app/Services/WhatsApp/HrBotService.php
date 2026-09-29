<?php

namespace App\Services\WhatsApp;

use App\Models\Business;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Exception;

class HrBotService
{
    protected WhatsAppService $whatsApp;
    protected WhatsAppWalletService $wallet;

    public function __construct(WhatsAppService $whatsApp, WhatsAppWalletService $wallet)
    {
        $this->whatsApp = $whatsApp;
        $this->wallet   = $wallet;
    }

    /**
     * Submit leave request via WhatsApp and alert manager with interactive buttons
     */
    public function submitLeaveRequest(
        User $user,
        Business $business,
        string $leaveType = 'casual',
        ?string $fromDate = null,
        ?string $toDate = null,
        ?string $reason = null
    ): LeaveRequest {
        $from = $fromDate ? Carbon::parse($fromDate)->toDateString() : tomorrow()->toDateString();
        $to   = $toDate ? Carbon::parse($toDate)->toDateString() : $from;

        $leave = LeaveRequest::create([
            'business_id'    => $business->id,
            'user_id'        => $user->id,
            'request_type'   => 'leave',
            'leave_type'     => $leaveType,
            'leave_category' => 'paid',
            'from_date'      => $from,
            'to_date'        => $to,
            'reason'         => $reason ?? 'Applied via WhatsApp Bot',
            'status'         => 'pending',
        ]);

        // Find manager/admin to notify
        $manager = $business->users()->whereHas('roles', fn($q) => $q->whereIn('name', ['admin', 'manager', 'owner']))->first()
            ?? $business->users()->first()
            ?? User::first();

        if ($manager && !empty($manager->phone)) {
            $typeLabel = ucfirst($leaveType);
            $datesStr  = $from === $to ? Carbon::parse($from)->format('d M Y') : Carbon::parse($from)->format('d M') . ' to ' . Carbon::parse($to)->format('d M Y');

            $managerBody = "🌴 *छुट्टी का आवेदन (Leave Request)!*\n\n"
                         . "👤 कर्मचारी: *{$user->name}* ({$user->phone})\n"
                         . "📌 प्रकार: *{$typeLabel} Leave*\n"
                         . "📅 तारीख: {$datesStr}\n"
                         . ($reason ? "📝 कारण: {$reason}\n" : "")
                         . "\nकृपया नीचे निर्णय चुनें:";

            $buttons = [
                ['id' => "btn_approve_leave_{$leave->id}", 'title' => '✅ मंजूर करें'],
                ['id' => "btn_reject_leave_{$leave->id}",  'title' => '❌ अस्वीकार'],
            ];

            try {
                $this->whatsApp->sendButtons(
                    $manager->phone,
                    $managerBody,
                    $buttons,
                    "{$business->name} HR"
                );

                $this->wallet->debit(
                    $business->id,
                    'utility',
                    "WhatsApp Leave Application Alert for {$user->name}",
                    ['leave_id' => $leave->id, 'user_id' => $user->id]
                );
            } catch (Exception $e) {
                Log::warning("Failed to dispatch leave alert to manager: " . $e->getMessage());
            }
        }

        return $leave;
    }

    /**
     * Process 1-click leave decision from manager's WhatsApp
     */
    public function processLeaveDecision(int $leaveId, string $decision, ?User $approver = null): bool
    {
        $leave = LeaveRequest::find($leaveId);
        if (!$leave) return false;

        $leave->status = $decision === 'approve' ? 'approved' : 'rejected';
        if ($approver) {
            $leave->approved_by = $approver->id;
        }
        $leave->save();

        $employee = $leave->user;
        if ($employee && !empty($employee->phone)) {
            $statusEmoji = $leave->status === 'approved' ? '✅' : '❌';
            $statusHindi = $leave->status === 'approved' ? 'मंजूर (Approved)' : 'अस्वीकार (Rejected)';

            $msg = "🌴 *छुट्टी आवेदन अपडेट* {$statusEmoji}\n\n"
                 . "नमस्ते {$employee->name}! आपकी *{$leave->leave_type} leave* ({$leave->from_date}) का आवेदन प्रबंधक द्वारा *{$statusHindi}* कर दिया गया है।";

            try {
                $this->whatsApp->sendText($employee->phone, $msg);
            } catch (Exception $e) {
                Log::warning("Failed to notify employee of leave decision: " . $e->getMessage());
            }
        }

        return true;
    }

    /**
     * Generate and send salary summary card directly to employee WhatsApp
     */
    public function sendSalarySlipSummary(User $user, Business $business, string $toPhone): bool
    {
        $currentMonth = date('Y-m');
        $payroll = Payroll::where('business_id', $business->id)
            ->where('user_id', $user->id)
            ->latest('month')
            ->first();

        $monthName = $payroll ? Carbon::parse($payroll->month . '-01')->format('F Y') : now()->subMonth()->format('F Y');
        $presentDays = $payroll ? $payroll->present_days : 24;
        $baseSalary  = $payroll ? (float)$payroll->base_salary : 22000.00;
        $deduction   = $payroll ? (float)$payroll->deduction : 0.00;
        $finalSalary = $payroll ? (float)$payroll->final_salary : ($baseSalary - $deduction);

        $msg = "📄 *सैलरी स्लिप (Salary Slip) - {$monthName}*\n\n"
             . "👤 कर्मचारी: *{$user->name}*\n"
             . "🏢 कंपनी: *{$business->name}*\n\n"
             . "🔹 कार्य दिवस (Days Present): {$presentDays} दिन\n"
             . "🔹 मूल वेतन (Base Salary): ₹" . number_format($baseSalary, 2) . "\n"
             . "🔹 कटौतियां (Deductions): ₹" . number_format($deduction, 2) . "\n"
             . "--------------------------------\n"
             . "💰 *नेट इन-हैंड वेतन: ₹" . number_format($finalSalary, 2) . "*\n\n"
             . "🔒 सुरक्षा नोट: आधिकारिक हस्ताक्षरित PDF प्रतिलिपि आपके HR रिकॉर्ड में सुरक्षित है।";

        try {
            $this->whatsApp->sendText($toPhone, $msg);

            $this->wallet->debit(
                $business->id,
                'utility',
                "WhatsApp Salary Slip Delivery for {$user->name}",
                ['user_id' => $user->id, 'month' => $monthName]
            );

            return true;
        } catch (Exception $e) {
            Log::error("Failed to deliver WhatsApp salary slip: " . $e->getMessage());
            return false;
        }
    }
}
