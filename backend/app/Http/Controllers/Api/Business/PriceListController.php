<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use App\Models\PriceList;
use App\Models\PriceListItem;

class PriceListController extends BaseController
{
    public function index(Request $request)
    {
        $priceLists = PriceList::all();
        return $this->success($priceLists, 'Price lists retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            PriceList::where('business_id', app('current_business_id'))->update(['is_default' => false]);
        }

        $priceList = PriceList::create($validated);
        return $this->success($priceList, 'Price list created successfully', 201);
    }

    public function show(PriceList $priceList)
    {
        return $this->success($priceList->load('items.product'), 'Price list retrieved successfully');
    }

    public function update(Request $request, PriceList $priceList)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['is_default']) && $validated['is_default']) {
            PriceList::where('business_id', app('current_business_id'))->where('id', '!=', $priceList->id)->update(['is_default' => false]);
        }

        $priceList->update($validated);
        return $this->success($priceList, 'Price list updated successfully');
    }

    public function destroy(PriceList $priceList)
    {
        $priceList->delete();
        return $this->success(null, 'Price list deleted successfully');
    }

    public function addItem(Request $request, PriceList $priceList)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rate' => 'required|numeric|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        $item = $priceList->items()->updateOrCreate(
            ['product_id' => $validated['product_id']],
            [
                'rate' => $validated['rate'],
                'discount_percent' => $validated['discount_percent'] ?? 0,
            ]
        );

        return $this->success($item, 'Item added to price list successfully');
    }

    public function removeItem(PriceList $priceList, PriceListItem $item)
    {
        if ($item->price_list_id === $priceList->id) {
            $item->delete();
        }
        return $this->success(null, 'Item removed from price list successfully');
    }
}
