import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    imageList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
  }),
);

const itemData = [
  {
    img: './15.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './16.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './17.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './18.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './19.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './20.png',
    title: 'Image',
    author: 'author',
  },
  {
    img: './21.png',
    title: 'Image',
    author: 'author',
  }
];

export default function BasicImageList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList className={classes.imageList} cols={2.5} rowHeight={300} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img src={item.img} alt={item.title}/>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}