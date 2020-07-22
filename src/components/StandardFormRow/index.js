import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const StandardFormRow = ({ title, children, last, block, grid,clickfn, ...rest },props) => {
  const cls = classNames(styles.standardFormRow, {
    [styles.standardFormRowBlock]: block,
    [styles.standardFormRowLast]: last,
    [styles.standardFormRowGrid]: grid,
  });

  return (
    <div className={cls} {...rest}>
      {title && (
        <div className={styles.label} onClick={()=>{clickfn?clickfn():null}}>
          <span style={clickfn?{border:"#0e6eb8 solid 1px",color:"#fff",padding:"0px 18px",borderRadius:6,lineHeight:"30px",cursor:"pointer",color:"#0e6eb8"}:{display:"block",padding:"0px 18px",color:"#666"}}>{title}</span>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default StandardFormRow;
