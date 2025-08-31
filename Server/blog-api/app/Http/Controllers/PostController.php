<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::with('user')->get());
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        $post = Post::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($post, 201);
    }

public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
         $post = Post::find($id);
    if (!$post) {
        return response()->json(['error' => 'Post not found'], 404);
    }
    return response()->json($post);
    }
}
