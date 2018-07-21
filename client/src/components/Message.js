import React from 'react';
import { Comment } from 'semantic-ui-react';

const Message = (props) => {
  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src={props.avatar} />
        <Comment.Content>
          <Comment.Author as='a'>{props.username}</Comment.Author>
          <Comment.Metadata>
            <div>{props.created_at}</div>
          </Comment.Metadata>
          <Comment.Text>{props.body}</Comment.Text>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
};

export default Message;
