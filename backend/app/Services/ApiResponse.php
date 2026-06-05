<?php

namespace App\Services;

class ApiResponse
{
    public static function success(mixed $data = null, string $message = 'Operation reussie', int $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function paginated($paginator)
    {
        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'meta' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public static function error(string $message, int $status = 400, array $errors = [])
    {
        $payload = ['success' => false, 'message' => $message];
        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
