import { loader, main } from "./index.js";
import {
  saveUsersToStorage,
  getUsersFromStorage,
  getAllPosts,
} from "./storage.js";

export const baseURL = "https://jsonplaceholder.typicode.com";

function createUserCard(user) {
  const card = /*html*/ `
        <article class="card" id="${user.id}">
            <h3 class="name">${user.name}</h3>
            <p class="username">username: ${user.username}</p>
            <p class="phone">Phone: ${user.phone}</p>
            <p class="email">Email: ${user.email}</p>
        </article>
    `;

  return card;
}

function createUserPage(user) {
  const userPage = /*html*/ `
    <section class="user-page">
      <h3 class="name">${user.name}</h3>
      <p class="username">username: ${user.username}</p>
      <p class="phone">Phone: ${user.phone}</p>
      <p class="email">Email: ${user.email}</p>
      <div class="address">
        <p>${user.address.city}</p>
        <p>${user.address.street}</p>
      </div>
      <div class="actions">
        <button id="back-btn">Back to user list</button>
        <button id="post-btn">Show posts</button>
      </div>
      <div class="posts hide">
      </div>
    </section>
  `;

  return userPage;
}

function createPosts(userPosts) {
  const postHTML = `
  <article class="post">
    <h3 class="post-title">${userPosts.title}</h3>
    <p class="post-body">${userPosts.body}</p>
  </article>
  `;
  return postHTML;
}

export async function getAllUsers() {
  const res = await fetch(baseURL + "/users");
  const users = await res.json();
  saveUsersToStorage(users);
  return users;
}

function getUserById(userId) {
  const users = getUsersFromStorage();
  const user = users.find((i) => i.id === Number(userId));

  return user;
}

async function handleOnCardClick(card) {
  insertLoaderToDOM();
  const user = getUserById(card.id);

  const userPageAsHtmlString = createUserPage(user);
  main.innerHTML = userPageAsHtmlString;

  await getPosts(user);

  const backButton = document.getElementById("back-btn");
  backButton.addEventListener("click", handleReturnButton);

  const showPostButton = document.getElementById("post-btn");
  showPostButton.addEventListener("click", togglePosts);
}

async function getPosts(user) {
  const posts = await getAllPosts();

  const userPosts = posts.filter((post) => post.userId === user.id);

  insertPostToDOM(userPosts);
}

function togglePosts() {
  document.querySelector(".posts").classList.toggle("hide");
}

export function handleOnClick(event) {
  const { target } = event;
  const closetsCard = target.closest(".card");
  if (closetsCard) handleOnCardClick(closetsCard);
}

function handleReturnButton() {
  const users = getUsersFromStorage();
  insertUsersToDOM(users);
}

function insertLoaderToDOM() {
  main.innerHTML = loader.outerHTML;
}

export function insertUsersToDOM(users) {
  const usersAsHtmlString = users.map((user) => createUserCard(user)).join("");
  main.innerHTML = usersAsHtmlString;
}

function insertPostToDOM(userPosts) {
  const userPostsAsHTMLString = userPosts
    .map((post) => createPosts(post))
    .join("");

  document.querySelector(".posts").innerHTML = userPostsAsHTMLString;
}
