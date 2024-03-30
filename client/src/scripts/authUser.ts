interface HTMLButtonElementEvent extends Event {
    target: HTMLButtonElement;
}

const navbarUnauthenticated = document.getElementById('navbar-unauthenticated') as HTMLElement;
const navbarAuthenticated = document.getElementById('navbar-authenticated') as HTMLElement;
const logoutButton = document.getElementById('btn-logout') as HTMLButtonElement;

class CookieManager {
    static getCookie(name: string): string | undefined {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return undefined;
    }

    static deleteCookie(name: string) {
        document.cookie = `${name}=; max-age=0`;
    }
}

function changeNavbar(token: string | undefined) {
    if (token) {
        console.log('Usuario autenticado');
        navbarUnauthenticated.classList.add('hidden');
        navbarAuthenticated.classList.remove('hidden');

        logoutButton.addEventListener('click', handleLogout);
    } else {
        console.log('Usuario no autenticado');
        navbarAuthenticated.classList.add('hidden');
        navbarUnauthenticated.classList.remove('hidden');
    }
}

function handleLogout(event: MouseEvent) {
    CookieManager.deleteCookie('jwt');
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', () => {
    const token = CookieManager.getCookie('jwt');
    changeNavbar(token);
});
