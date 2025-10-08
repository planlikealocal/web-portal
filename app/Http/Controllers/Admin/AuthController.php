<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Auth\AuthenticateAdminAction;
use App\Actions\Auth\LogoutAdminAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(
        private AuthenticateAdminAction $authenticateAdminAction,
        private LogoutAdminAction $logoutAdminAction,
    ) {}

    /**
     * Show the admin login form
     */
    public function showLoginForm()
    {
        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin login
     */
    public function login(AdminLoginRequest $request)
    {
        $result = $this->authenticateAdminAction->execute($request->validated(), $request);

        if ($result['success']) {
            return redirect()->intended($result['redirect']);
        }

        return back()->withErrors([
            'message' => $result['message'],
        ]);
    }

    /**
     * Handle admin logout
     */
    public function logout(Request $request)
    {
        $this->logoutAdminAction->execute($request);
        
        return redirect()->route('admin.login');
    }
}
