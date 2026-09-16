<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\PayrollComponent;
use Illuminate\Http\Request;

class PayrollComponentController extends BaseController
{
    public function index()
    {
        if (PayrollComponent::count() === 0) {
            $defaults = [
                ['name' => 'Basic Salary', 'type' => 'earning', 'is_default' => true],
                ['name' => 'House Rent Allowance (HRA)', 'type' => 'earning', 'is_default' => true],
                ['name' => 'Special Allowance', 'type' => 'earning', 'is_default' => true],
                ['name' => 'Provident Fund (PF)', 'type' => 'deduction', 'is_default' => true],
                ['name' => 'Employee State Insurance (ESI)', 'type' => 'deduction', 'is_default' => true],
                ['name' => 'Professional Tax (PT)', 'type' => 'deduction', 'is_default' => true],
            ];
            foreach ($defaults as $d) {
                PayrollComponent::create($d);
            }
        }

        $components = PayrollComponent::all();
        return $this->success($components, 'Payroll components retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:earning,deduction',
        ]);

        // Check for duplicates
        if (PayrollComponent::where('name', $request->name)->exists()) {
            return $this->error('A component with this name already exists.', 422);
        }

        $component = PayrollComponent::create([
            'name' => $request->name,
            'type' => $request->type,
            'is_default' => false,
        ]);

        return $this->success($component, 'Component created successfully', 201);
    }

    public function show($id)
    {
        $component = PayrollComponent::findOrFail($id);
        return $this->success($component, 'Component retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:earning,deduction',
        ]);

        $component = PayrollComponent::findOrFail($id);

        if ($component->is_default) {
            return $this->error('Cannot update a default component.', 403);
        }

        // Check for duplicates
        if (PayrollComponent::where('name', $request->name)
            ->where('id', '!=', $id)
            ->exists()) {
            return $this->error('A component with this name already exists.', 422);
        }

        $component->update([
            'name' => $request->name,
            'type' => $request->type,
        ]);

        return $this->success($component, 'Component updated successfully');
    }

    public function destroy($id)
    {
        $component = PayrollComponent::findOrFail($id);

        if ($component->is_default) {
            return $this->error('Cannot delete a default component.', 403);
        }

        $component->delete();
        return $this->success(null, 'Component deleted successfully');
    }
}
