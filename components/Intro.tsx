function Intro() {
  return (
    <div className="w-full h-auto">
      <img
        src={"/images/bee.jfif"}
        className="h-44 w-full object-cover"
        alt="Bee"
      />
      <div className="bg-yellow-300 h-22 flex rounded-b-2xl">
        <h2 className="  font-bold  md:text-2xl text-center py-3 px-5">
          Bee CTRL
        </h2>
        <div className="flex">
          <div className=" bg-black w-3 h-full relative flex flex-none ml-4"></div>
          <div className=" bg-black w-3 h-full relative flex flex-none ml-4"></div>
          <div className=" bg-black w-3 h-full relative flex flex-none ml-4"></div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
