import { useCookies } from "react-cookie";

export type Tag = {
  name: string;
  color: string;
};

export const useTags = (): [Tag[], (tags: Tag[]) => void] => {
  const { 0: cookies, 1: setCookie } = useCookies(["tags"]);

  if (!cookies.tags) {
    setCookie(
      "tags",
      JSON.stringify([
        {
          name: "attack",
          color: "bg-red-500",
        },
        {
          name: "saving throw",
          color: "bg-blue-500",
        },
        {
          name: "check",
          color: "bg-green-500",
        },
      ] as Tag[]),
      {
        path: "/",
      }
    );
  }

  const updateTagList = (tags: Tag[]) => {
    setCookie("tags", tags);
  };

  return [
    !cookies.tags
      ? [
          {
            name: "attack",
            color: "bg-red-500",
          },
          {
            name: "saving throw",
            color: "bg-blue-500",
          },
          {
            name: "check",
            color: "bg-green-500",
          },
        ]
      : cookies.tags,
    updateTagList,
  ];
};
