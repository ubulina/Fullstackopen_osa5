import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Errorinfo from './components/Errorinfo'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((first, second) => second.likes - first.likes))
    )

  }, [])

  //kun sivulle tullaan uudestaan, tarkistetaan löytyykö local storagesta
  //tietoja kirjautuneesta käyttäjästä, eli tarkistetaan onko joku kirjautuneena
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) //tieto tokenista asetetaan blogServicelle
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    //setBlogs(blogs.sort((first, second) => second.likes - first.likes))

    setInfoMessage(
      `A new blog '${blogObject.title}' by ${blogObject.author} added`
    )
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)

  }

  //toiminnallisuus lähetetään Blog-komponentille propsina
  const addLikeOf = (id) => {

    blogService
      .update(id)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(error => console.log(error))

    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs.sort((first, second) => second.likes - first.likes))
      )
  }

  //toiminnallisuus lähetetään Blog-komponentille propsina
  const removeBlog = (id) => {

    const blog = blogs.find(b => b.id === id)

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {

      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
        })
    }

  }


  //BlogFormin näkymistä säätelevä funktio
  //funktion sisällä lähetetään BlogFormille addBlog-funktio, joka kommunikoi tietokannan kanssa
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        createBlog={addBlog}
      />
    </Togglable>
  )

  if (user === null) {

    return (
      <div>
        <h2>Log in to application</h2>

        <Errorinfo errorMessage={errorMessage} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={infoMessage} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} addLike={() => addLikeOf(blog.id)} remove={() => removeBlog(blog.id)} />
      )}
    </div>
  )
}

export default App