import React, { Component } from 'react';
import axios from 'axios';
import NewsArticle from './NewsArticle';

class HomeNews extends Component {
  constructor() {
    super();
    this.state = {
      newsArticles: []
    };
  }

  componentDidMount = async () => {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?sources=the-wall-street-journal&apiKey=0c652481b5f44fef94e0fb2a5802bf5d`);
    const newsData = response.data.articles;

    this.setState({
      newsArticles: newsData
    });
  }

  render() {
    return (
      <div>
        {this.state.newsArticles.map((article, index) => {
          return (
            <div>
              <NewsArticle key={index} article={article} />
              <br></br>
              <br></br>
            </div>
          );
        })}
      </div>
    );
  }
};

export default HomeNews;
