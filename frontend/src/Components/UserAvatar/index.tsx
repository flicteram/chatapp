import Avatar from '@mui/material/Avatar';
import { useState, memo } from 'react';
import Skeleton from '@mui/material/Skeleton'
interface Props {
  hasProfilePicture: boolean,
  isLoading:boolean,
  pictureToShow?: string | JSX.Element,
  sx?:{
    width:string,
    height:string
  }
}

function UserAvatar({
  hasProfilePicture,
  pictureToShow,
  isLoading,
  sx
}:Props ){
  const [profileImgError, setProfileImgError] = useState( false )
  const shouldUseBackgroundColor = ( !hasProfilePicture && !profileImgError ) ? { backgroundColor: 'var(--tealGreen)' } : {}
  const handleOnImgError = ()=> setProfileImgError( true )

  const imgStyle = sx ? sx : {
    width: '45px',
    height: '45px'
  }
  if( isLoading ){
    return <Skeleton
      data-testid="loadingSkeleton"
      variant="circular"
      width={40}
      height={40}/>
  }

  return(
    <Avatar
      data-testid="avatarTest"
      style={shouldUseBackgroundColor}
      sx={sx}
    >
      {hasProfilePicture && !profileImgError && typeof pictureToShow === 'string'?
        <img
          data-testid="imgTest"
          onError={handleOnImgError}
          referrerPolicy="no-referrer"
          src={pictureToShow}
          style={imgStyle}/>
        :
        pictureToShow
      }
    </Avatar>
  )
}

export default memo( UserAvatar )