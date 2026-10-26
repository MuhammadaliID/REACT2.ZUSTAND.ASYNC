import axios from "axios";
import { create } from "zustand";



export let useData = create((set) => ({
  data: [],
  loading: false,
  error: null,

  getUsers: async () => {
    set({ loading: true, error: null });


    try {
      let { data } = await axios.get("https://6a56fbf4b17de7bebbdeaff0.mockapi.io/PEOPLE")

      set({ data: data })

    } catch (error) {
      set({ loading: false })
    }

    finally {
      set({ loading: false })
    }

  },


  addUser: async (data) => {
    const { data: newUser } = await axios.post(
      "https://6a56fbf4b17de7bebbdeaff0.mockapi.io/PEOPLE",
      data
    );

    set((state) => ({
      data: [...state.data, newUser],
    }));
  },

  editUser: async (id, user) => {
    const res = await axios.put(
      `https://6a56fbf4b17de7bebbdeaff0.mockapi.io/PEOPLE/${id}`,
      user
    )

    set((state) => ({
      data: state.data.map((elem) =>
        elem.id === id ? res.data : elem
      )
    }))
  }

}))