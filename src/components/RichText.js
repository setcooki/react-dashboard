import React, {useEffect, useState} from 'react';
import MUIRichTextEditor from 'mui-rte';
import {convertToRaw, convertFromHTML, ContentState} from "draft-js";
import {stateToHTML} from 'draft-js-export-html';

const RichText = (props) => {

  const [value, setValue] = useState(JSON.stringify(convertToRaw(ContentState.createFromText(''))));
  const [initialized, setInitialzed] = useState(false);
  const [timer, setTimer] = useState(null);
  const rteControls = ['bold', 'italic', 'underline', 'quote', 'bulletList', 'link', 'media'];

  const onChangeHandler = (state) => {
    if ('onChange' in props) {
      if (timer !== null) {
        clearTimeout(timer);
        setTimer(null);
      }
      setTimer(setTimeout(() => {
        props.onChange(stateToHTML(state.getCurrentContent()));
      }, 250));
    }
  };

  useEffect(() => {
    if (props.content && !initialized) {
      try {
        JSON.parse(props.content);
        setValue(props.content);
      } catch (e) {
        let html = convertFromHTML(props.content);
        setValue(JSON.stringify(convertToRaw(ContentState.createFromBlockArray(html.contentBlocks, html.entityMap))));
      }
      setInitialzed(true);
    } else if (props.content === '' || props.content === null) {
      setValue(JSON.stringify(convertToRaw(ContentState.createFromText(''))));
    }
  }, [props.content, initialized]);

  return (
    <React.Fragment>
      <MUIRichTextEditor
        value={value}
        toolbarButtonSize="small"
        controls={rteControls}
        onChange={onChangeHandler}
      />
    </React.Fragment>
  );
};

export default React.memo(RichText);
