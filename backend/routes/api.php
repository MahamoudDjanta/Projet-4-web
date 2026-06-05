<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EleveController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PermissionAbsenceController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\RequetePresenceController;
use App\Http\Controllers\SessionPresenceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/presences/scan-qr', [PresenceController::class, 'scanQR']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        Route::apiResource('classes', ClasseController::class)->only(['store', 'update', 'destroy'])->middleware('role:admin,professeur');
        Route::apiResource('classes', ClasseController::class)->only(['index', 'show']);
        Route::apiResource('eleves', EleveController::class)->parameters(['eleves' => 'eleve'])->middleware('role:admin,professeur');
        Route::apiResource('cours', CoursController::class)->parameters(['cours' => 'cour'])->only(['store', 'update', 'destroy'])->middleware('role:admin,professeur');
        Route::apiResource('cours', CoursController::class)->parameters(['cours' => 'cour'])->only(['index', 'show']);
        Route::get('/cours/programme/{classeId}', [CoursController::class, 'programme']);

        Route::get('/sessions', [SessionPresenceController::class, 'index'])->middleware('role:admin,professeur');
        Route::post('/sessions', [SessionPresenceController::class, 'store'])->middleware('role:admin,professeur');
        Route::get('/sessions/{id}', [SessionPresenceController::class, 'show']);
        Route::post('/sessions/{id}/cloturer', [SessionPresenceController::class, 'cloturer'])->middleware('role:admin,professeur');
        Route::get('/sessions/{id}/qr-token', [SessionPresenceController::class, 'getQRToken']);

        Route::get('/presences', [PresenceController::class, 'index'])->middleware('role:admin,professeur');
        Route::delete('/presences/clear', [PresenceController::class, 'clearMarked'])->middleware('role:admin,professeur');
        Route::post('/presences/marquer', [PresenceController::class, 'marquer'])->middleware('role:admin,professeur');
        Route::post('/presences/marquer-liste', [PresenceController::class, 'marquerListe'])->middleware('role:admin,professeur');

        Route::apiResource('users', UserController::class)->only(['index', 'store', 'destroy'])->middleware('role:admin');

        Route::get('/notifications', [NotificationController::class, 'index']);

        Route::get('/requetes', [RequetePresenceController::class, 'index']);
        Route::post('/requetes', [RequetePresenceController::class, 'store']);
        Route::patch('/requetes/{id}/traiter', [RequetePresenceController::class, 'traiter'])->middleware('role:admin,professeur');

        Route::get('/permissions', [PermissionAbsenceController::class, 'index']);
        Route::post('/permissions', [PermissionAbsenceController::class, 'store']);
        Route::patch('/permissions/{id}/statut', [PermissionAbsenceController::class, 'updateStatut'])->middleware('role:admin,professeur');

        Route::get('/rapports/preview', [RapportController::class, 'preview'])->middleware('role:admin,professeur');
        Route::get('/rapports/pdf', [RapportController::class, 'genererPDF'])->middleware('role:admin,professeur');
    });
});
