const designImages = [
  {
    id: 1,
    title: "Birthday Card",
    url: "images/projects/designs/Birthday.jpg",
  },
  {
    id: 2,
    title: "Freshko Brochure",
    url: "images/projects/designs/Freshko.jpg",
  },
  {
    id: 3,
    title: "Menu Design",
    url: "images/projects/designs/Menu.jpg",
  },
  {
    id: 4,
    title: "Relex Therapy Brochure",
    url: "images/projects/designs/RelexTherapy.jpg",
  },
];

const DesignPreview = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 ">Designs</h1>

      <div className=" w-full h-full grid grid-cols-4 gap-6">
        {designImages.map((p) => {
          if (p.id % 2 === 0) {
            return (
              <div className="flex flex-col mt-3">
                <img
                  class="w-full rounded-lg"
                  src={p.url}
                  alt="Design Preview"
                />
                <h2 className="text-3xl font-bold mb-2 mt-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  {p.title}
                </h2>
              </div>
            );
          } else {
            return (
              <div className="flex flex-col mb-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  {p.title}
                </h2>
                <img
                  class="mt-4 w-full lg:mt-10 rounded-lg"
                  src={p.url}
                  alt="Design Preview"
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default DesignPreview;
