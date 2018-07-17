import React from 'react';

const NewsArticle = (props) => {
  return (
    <div>
      <p>{props.article.title}</p>
      <p>{props.article.description}</p>
    </div>
  );
};

export default NewsArticle;
