interface HTMLButtonElementEvent extends Event {
  target: HTMLButtonElement;
}

const navbarUnauthenticated = document.getElementById(
  "navbar-unauthenticated"
) as HTMLElement;
const navbarAuthenticated = document.getElementById(
  "navbar-authenticated"
) as HTMLElement;
const logoutButton = document.getElementById("btn-logout") as HTMLButtonElement;

class CookieManager {
  static getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return undefined;
  }

  //Si la cookie no se borra, puede ser debido a que la cookie tiene un dominio y/o un camino (path) establecido. Cuando se establece una cookie con un dominio y/o un camino, solo se puede borrar utilizando el mismo dominio y camino.
  static deleteCookie(name: string) {
    document.cookie = `${name}=; max-age=0; path=/; domain=${window.location.hostname}`;
  }
}

function changeNavbar(token: string | undefined) {
  if (token) {
    console.log("Usuario autenticado");
    navbarUnauthenticated.classList.add("hidden");
    navbarAuthenticated.classList.remove("hidden");

    logoutButton.addEventListener("click", handleLogout);
  } else {
    console.log("Usuario no autenticado");
    navbarAuthenticated.classList.add("hidden");
    navbarUnauthenticated.classList.remove("hidden");
  }
}

function handleLogout(event: MouseEvent) {
  CookieManager.deleteCookie("jwt");
  window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", () => {
  const token = CookieManager.getCookie("jwt");
  changeNavbar(token);
});
