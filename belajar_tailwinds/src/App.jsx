import { useState } from "react";

function App() {
  return (
    <div class="grid grid-cols-8 grid-rows-5 gap-4">
      <div class="col-span-2 row-span-5 col-start-2 bg-red-500 h-full w-full"></div>
      
      <div class="col-span-3 row-span-5 col-start-4">3</div>
      <div class="row-span-5 col-start-7">4</div>
    </div>
  );
}

export default App;
