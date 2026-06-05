<?php

namespace App\Services;

use Illuminate\Support\Str;

class QRCodeService
{
    public function token(): string
    {
        return 'sess_'.Str::random(32);
    }
}
