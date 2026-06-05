<?php

namespace App\Http\Controllers;

use App\Services\ApiResponse;
use App\Services\PresenceService;

class DashboardController extends Controller
{
    public function stats(PresenceService $presenceService)
    {
        return ApiResponse::success($presenceService->dashboardStats());
    }
}
