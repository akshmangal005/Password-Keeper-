export const Box = ({ children,heading}: any) => {
  return (
    <div className="flex items-center justify-center w-auto h-screen">
      <div className="p-5 pb-10 border flex-col gap-5 rounded-md shadow-xl h-auto w-[20rem]">
        <div className="items-center justify-center flex mt-5 mb-5 text-2xl font-bold">{heading}</div>
        {children}
      </div>
    </div>
  );
};
