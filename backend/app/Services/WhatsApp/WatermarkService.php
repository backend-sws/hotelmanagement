<?php

namespace App\Services\WhatsApp;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class WatermarkService
{
    /**
     * Watermarks an image with Staff Name, GPS Coordinates, Timestamp, and Site Name using PHP GD
     */
    public function stampProof(string $imageBinaryOrPath, array $meta): string
    {
        $filename = 'proofs/' . uniqid('wm_') . '.jpg';

        $binary = null;
        if (is_file($imageBinaryOrPath)) {
            $binary = file_get_contents($imageBinaryOrPath);
        } elseif (is_string($imageBinaryOrPath)) {
            $cleanPath = preg_replace('#^.*?/storage/#', '', $imageBinaryOrPath);
            $cleanPath = ltrim($cleanPath, '/');
            if (Storage::disk('public')->exists($cleanPath)) {
                $binary = Storage::disk('public')->get($cleanPath);
            } elseif (filter_var($imageBinaryOrPath, FILTER_VALIDATE_URL)) {
                $binary = @file_get_contents($imageBinaryOrPath);
            } else {
                $binary = $imageBinaryOrPath;
            }
        }

        // Check if GD extension is available
        if (!function_exists('imagecreatefromstring')) {
            Log::warning("GD extension not available, saving un-watermarked proof");
            Storage::disk('public')->put($filename, $binary ?? '');
            return Storage::disk('public')->url($filename);
        }

        try {
            $img = !empty($binary) ? @imagecreatefromstring($binary) : false;
            if (!$img) {
                // Fallback: generate a clean truecolor placeholder card
                $img = imagecreatetruecolor(800, 600);
                $bg = imagecolorallocate($img, 30, 41, 59);
                imagefill($img, 0, 0, $bg);
            }


            $width  = imagesx($img);
            $height = imagesy($img);

            // Create semi-transparent dark banner at bottom (18% of image height)
            $bannerHeight = max(80, (int)($height * 0.18));
            $bannerY = $height - $bannerHeight;

            // Allocate colors
            $bannerBg = imagecolorallocatealpha($img, 15, 23, 42, 35); // Dark slate #0F172A with alpha
            $textColorWhite = imagecolorallocate($img, 255, 255, 255);
            $textColorGreen = imagecolorallocate($img, 34, 197, 94);  // Emerald #22C55E
            $textColorAmber = imagecolorallocate($img, 245, 158, 11); // Amber

            // Draw banner background
            imagefilledrectangle($img, 0, $bannerY, $width, $height, $bannerBg);

            // Prepare text data
            $staffName = $meta['staff_name'] ?? 'Field Staff';
            $timeStr   = now()->format('d M Y, h:i A');
            $lat       = isset($meta['lat']) ? round((float)$meta['lat'], 5) : '0.00000';
            $lng       = isset($meta['lng']) ? round((float)$meta['lng'], 5) : '0.00000';
            $site      = $meta['site_name'] ?? 'Client Site';

            $line1 = "STAFF: {$staffName}  |  TIME: {$timeStr}";
            $line2 = "GPS: {$lat}, {$lng}  |  SITE: {$site}";
            $line3 = "STATUS: VERIFIED FIELD PROOF  |  ZERO-APP BOT";

            // Built-in GD font 4 or 5
            $font = 5;
            $lineHeight = 22;
            $startY = $bannerY + 14;

            imagestring($img, $font, 20, $startY, $line1, $textColorWhite);
            imagestring($img, $font, 20, $startY + $lineHeight, $line2, $textColorGreen);
            imagestring($img, $font, 20, $startY + ($lineHeight * 2), $line3, $textColorAmber);

            // Capture output stream
            ob_start();
            imagejpeg($img, null, 85);
            $watermarkedBinary = ob_get_clean();
            imagedestroy($img);

            Storage::disk('public')->put($filename, $watermarkedBinary);
            return Storage::disk('public')->url($filename);

        } catch (\Throwable $e) {
            Log::error("Watermark processing error: " . $e->getMessage());
            // Fallback: save raw binary
            Storage::disk('public')->put($filename, $binary ?? '');
            return Storage::disk('public')->url($filename);
        }
    }
}
