"use client";
import * as React from "react";

export function ActionButtons() {
  return (
    <section className="flex gap-8 mt-5 max-md:flex-col max-md:gap-5">
      <button
        className="text-4xl font-bold text-white cursor-pointer bg-yellow-950 h-[100px] rounded-[30px] w-[287px] max-sm:w-full max-sm:h-20 max-sm:text-3xl max-sm:max-w-[287px]"
        onClick={() => {}}
        aria-label="Sign Up"
      >
        Sign Up
      </button>
      <button
        className="text-4xl font-bold text-white bg-orange-400 cursor-pointer h-[100px] rounded-[30px] w-[287px] max-sm:w-full max-sm:h-20 max-sm:text-3xl max-sm:max-w-[287px]"
        onClick={() => {}}
        aria-label="Log In"
      >
        Log In
      </button>
    </section>
  );
}