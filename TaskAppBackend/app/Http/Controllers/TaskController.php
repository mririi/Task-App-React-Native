<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Requests\tasksvalidation;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user=Auth::user()->id;
        return Task::where('userid', $user)->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(tasksvalidation $request)
    {
        $task=$request->validated();
        return Task::create(['title'=>$task['title'],'userid'=>Auth::user()->id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task=Task::find($id);
        $user=Auth::user()->id;
        if ($user == $task->userid){
            Task::destroy($id);
            return "The Task is deleted";
        }else{
            return "This task is not the proprety of the connected user!";
        }
    }
}
