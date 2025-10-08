<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface AuthServiceInterface
{
    public function authenticate(array $credentials, Request $request): array;
    public function logout(Request $request): void;
    public function isAdmin(): bool;
}
