<?php

namespace App\Http\Controllers\Specialist;

use App\Actions\Auth\AuthenticateSpecialistAction;
use App\Actions\Auth\LogoutSpecialistAction;
use App\Actions\Auth\SendPasswordResetLinkAction;
use App\Actions\Auth\ResetPasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpecialistLoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(
        private AuthenticateSpecialistAction $authenticateSpecialistAction,
        private LogoutSpecialistAction $logoutSpecialistAction,
        private SendPasswordResetLinkAction $sendPasswordResetLinkAction,
        private ResetPasswordAction $resetPasswordAction,
    ) {}

    /**
     * Show the specialist login form
     */
    public function showLoginForm()
    {
        return Inertia::render('Specialist/Login');
    }

    /**
     * Handle specialist login
     */
    public function login(SpecialistLoginRequest $request)
    {
        $result = $this->authenticateSpecialistAction->execute($request->validated(), $request);

        if ($result['success']) {
            return redirect()->intended($result['redirect']);
        }

        return back()->withErrors([
            'message' => $result['message'],
        ]);
    }

    /**
     * Handle specialist logout
     */
    public function logout(Request $request)
    {
        $this->logoutSpecialistAction->execute($request);
        
        return redirect()->route('specialist.login');
    }

    /**
     * Show the forgot password form
     */
    public function showForgotPasswordForm()
    {
        return Inertia::render('Specialist/ForgotPassword');
    }

    /**
     * Send password reset link
     */
    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        try {
            $result = $this->sendPasswordResetLinkAction->execute($request->email);

            if ($result['success']) {
                return back()->with('success', $result['message']);
            }

            return back()->withErrors(['message' => $result['message']]);
        } catch (\Exception $e) {
            \Log::error('Controller error during password reset request', [
                'email' => $request->email,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['message' => 'An unexpected error occurred. Please try again later.']);
        }
    }

    /**
     * Show the reset password form
     */
    public function showResetForm($token)
    {
        return Inertia::render('Specialist/ResetPassword', [
            'token' => $token,
        ]);
    }

    /**
     * Reset the password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        try {
            $result = $this->resetPasswordAction->execute($request->token, $request->password);

            if ($result['success']) {
                return redirect()->route('specialist.login')->with('success', $result['message']);
            }

            return back()->withErrors(['message' => $result['message']]);
        } catch (\Exception $e) {
            \Log::error('Controller error during password reset', [
                'token' => substr($request->token, 0, 20) . '...',
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['message' => 'An unexpected error occurred. Please try again later.']);
        }
    }
}
