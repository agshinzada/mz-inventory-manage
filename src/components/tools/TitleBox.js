function TitleBox({ title }) {
  return (
    <h1 className="desktop:text-sm mobile:text-xs font-bold bg-blue-800 dark:bg-gray-800 rounded-md text-white py-2 px-4 absolute top-20">
      {title.toLocaleUpperCase("az")}
    </h1>
  );
}

export default TitleBox;
