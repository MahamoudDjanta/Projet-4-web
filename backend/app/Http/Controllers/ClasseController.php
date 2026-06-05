<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Services\ApiResponse;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        return ApiResponse::success(Classe::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['nom' => ['required'], 'niveau' => ['nullable']]);

        return ApiResponse::success(Classe::create($data), 'Classe creee', 201);
    }

    public function show(Classe $class)
    {
        return ApiResponse::success($class->load('eleves.user', 'cours'));
    }

    public function update(Request $request, Classe $class)
    {
        $class->update($request->only('nom', 'niveau'));

        return ApiResponse::success($class, 'Classe mise a jour');
    }

    public function destroy(Classe $class)
    {
        $class->delete();

        return ApiResponse::success(null, 'Classe supprimee');
    }
}
