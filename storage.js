import { baseURL } from "./utilties.js";

export function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getUsersFromStorage() {
  return JSON.parse(localStorage.getItem("users"));
}

function savePostsToStorage(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
  console.log("saved Posts");
}

function getPostsFromStorage() {
  return JSON.parse(localStorage.getItem("posts"));
}

export async function getAllPosts() {
  if (!getPostsFromStorage()) {
    const res = await fetch(baseURL + "/posts");
    const posts = await res.json();
    savePostsToStorage(posts);
    return posts;
  } else {
    return getPostsFromStorage();
  }
}
