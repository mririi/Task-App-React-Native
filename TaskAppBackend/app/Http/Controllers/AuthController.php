<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use App\Http\Requests\loginvalidation;
use App\Http\Requests\registervalidation;

class AuthController extends Controller
{
    public function register(registervalidation $request) {
        $fields = $request->validated();

        $user = User::create([
            'fullname' => $fields['fullname'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password'])
        ]);

        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function login(loginvalidation $request) {
        $fields = $request->validated();

        // Check email
        $user = User::where('email', $fields['email'])->first();

        // Check password
        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Wrong credentials, Check your email and password!'
            ], 401);
        }
        
        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }
    public function getUserByToken($token)
    {
        $token = PersonalAccessToken::findToken($token);
        $user = $token->tokenable;
        return $user;
    }
    
    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }
}
