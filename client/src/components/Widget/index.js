import React from 'react';

const Widget = (props) => {

  return (
    <article className={`widget ${props.customClasses}`}>
    {props.children}
    </article>
  )
}

export default Widget;