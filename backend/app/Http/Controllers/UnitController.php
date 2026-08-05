<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::all();
        return response()->json(['data' => $units]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $unit = Unit::firstOrCreate([
            'name' => trim($request->name),
        ]);

        return response()->json($unit, 201);
    }
}
