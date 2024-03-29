interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  score: number;
  ratings: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  list: async (): Promise<Restaurant[]> => {
    const [, ...data] = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzEaocaqq1U0BcVfOz9ta1aCuO7LRqi8QfS51Uc-zEQcn1buLkBQdT-vQoD8BRXp2xSxlBfy4yzmjz/pub?gid=0&single=true&output=csv",
    )
      .then((res) => res.text())
      .then((text) => text.split("\n"));

    const restaurants: Restaurant[] = data.map((row) => {
      const [id, name, description, address, score, ratings, image] =
        row.split(",");
      return {
        id,
        name,
        description,
        address,
        score: Number(score),
        ratings: Number(ratings),
        image,
      };
    });

    return restaurants;
  },

  fetch: async (id: Restaurant["id"]): Promise<Restaurant> => {
    await sleep(750);

    const [, ...data] = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzEaocaqq1U0BcVfOz9ta1aCuO7LRqi8QfS51Uc-zEQcn1buLkBQdT-vQoD8BRXp2xSxlBfy4yzmjz/pub?gid=0&single=true&output=csv",
    )
      .then((res) => res.text())
      .then((text) => text.split("\n"));

    const restaurants: Restaurant[] = data.map((row) => {
      const [id, name, description, address, score, ratings, image] =
        row.split(",");
      return {
        id,
        name,
        description,
        address,
        score: Number(score),
        ratings: Number(ratings),
        image,
      };
    });

    const restaurant = restaurants.find((restaurant) => restaurant.id === id);

    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }

    return restaurant;
  },

  search: async (query: string = ""): Promise<Restaurant[]> => {
    const results = await api
      .list()
      .then((restaurants) =>
        restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );

    if (results.length === 0) {
      api.list();
    }

    return results;
  },

  fetchDogImage: async (): Promise<string> => {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error("Could not fetch the image");
    }

    return data.message;
  },
};

export default api;
