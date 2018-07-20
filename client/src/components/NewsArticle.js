import React from 'react';

const NewsArticle = (props) => {
  return (
    <div>
      <p><strong>{props.article.title}</strong></p>
      <p>{props.article.description}</p>
    </div>
  );
};

export default NewsArticle;
