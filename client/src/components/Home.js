import React from 'react';
import HomeNews from './HomeNews';
import { Grid } from 'semantic-ui-react';

const Home = () => {
  return (
    <div>
      <Grid>
        <Grid.Column width={8}>
          <HomeNews />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Home;