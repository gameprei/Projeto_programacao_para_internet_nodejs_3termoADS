export default function verifyAuthenticate(request, answer, next) {
    if (request?.session?.authenticated) {
        next();
    } else {
        answer.redirect('/login.html');
    }
}


