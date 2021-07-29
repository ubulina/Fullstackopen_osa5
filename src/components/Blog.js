import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, addLike, remove }) => {

    const [showAllInfo, setShowAllInfo] = useState(false)

    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 3,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const hideWhenVisible = { display: showAllInfo ? 'none' : ' ' }
    const showWhenVisible = { display: showAllInfo ? ' ' : 'none' }

    if(blog.user) {

        return (

            <div style={blogStyle}>
                <span id='titleandauthor'>{blog.title} {blog.author}</span>

                <button id='view-button' style={hideWhenVisible} onClick={ () => setShowAllInfo(true) }>view</button>
                <button style={showWhenVisible} onClick={ () => setShowAllInfo(false) }>hide</button>

                <div style={showWhenVisible}>

                    {blog.url}<br />
                    likes {blog.likes}  <button id='like-button' onClick={addLike}>like</button><br />
                    {user.name}<br />
                    <button id='remove-button' className="button2" onClick={remove}>remove</button>
                </div>
            </div>

        )
    }

    return (

        <div style={blogStyle}>

            {blog.title} {blog.author}

            <button id='view-button' style={hideWhenVisible} onClick={ () => setShowAllInfo(true) }>view</button>
            <button className="moreInfo" style={showWhenVisible} onClick={ () => setShowAllInfo(false) }>hide</button>

            <div style={showWhenVisible}>

                {blog.url}<br />
                likes {blog.likes} <button id='like-button' onClick={addLike}>like</button>

            </div>

        </div>

    )

}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    //user: PropTypes.object.isRequired,
    //addLike: PropTypes.func.isRequired,
    //remove: PropTypes.func.isRequired
}

export default Blog