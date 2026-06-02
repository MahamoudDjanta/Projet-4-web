<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PresenceController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/presences/dashboard', [PresenceController::class, 'dashboard']);
    Route::post('/presences', [PresenceController::class, 'store']);
    Route::patch('/presences/{id}/close', [PresenceController::class, 'close']);
    Route::post('/presences/qr/scan', [PresenceController::class, 'scanQr']);
});
Route::get('/test', function () {
    return response()->json([
        'message' => 'API OK'
    ]);
});