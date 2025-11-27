import type { Board } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const boards: Board[] = [
    {
      slug: "project-alpha",
      name: "project alpha",
      dateCreated: "2024-01-15",
      dateUpdated: "2025-04-10",
    },
    {
      slug: "design-board",
      name: "design board",
      dateCreated: "2024-02-20",
      dateUpdated: "2025-05-05",
    },
    {
      slug: "development-tasks",
      name: "development tasks",
      dateCreated: "2024-03-10",
      dateUpdated: "2025-06-01",
    },
  ];

  return { boards };
}) satisfies PageServerLoad;
