import React from 'react'

const Errorinfo = ({ errorMessage }) => {

    if (errorMessage === null) {
        return null
      }
    
      return (
        <div className='error'>
          {errorMessage}
        </div>
      )


}


export default Errorinfo