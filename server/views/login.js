import basic from './basic'
export default function () {
  return basic({
    title: 'Login | Gramforacause',
    head: `
      <style>
        .login__container {
          margin: 0 auto;
          width: 200px;
        }
      </style>
    `,
    body: `
      <h1>Welcome to Gramforacause</h1>
      <div class="login__container">
        <h2>Login!</h2>
        <form action="/login" method="POST">
          <label for="email">
            Email:
            <input type="text" name="email">
          </label>
          <label for="password">
            Password:
            <input type="password" name="password">
          </label>
          <button class="btn">Login</button>
        </form>

        <a class="btn"href="/register" alt="Create an Account">
          Create an Account
        </a>
        <a class="btn"href="/forgot-password" alt="Create an Account">
          Forgot Password?
        </a>
      </div>
    `
  })
}
