import React from "react";

type Props = {
  img?: string;
};

export default function PhotoResult(props: Props) {
  return <img src={props.img}></img>;
}
