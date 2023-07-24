import UserAvatar from "..";
import { fireEvent, render } from "@testing-library/react";
import '@testing-library/jest-dom';

describe( "test UserAvatar", ()=>{
  it( "if loading is false should return loading skeleton", ()=>{
    const {
      getByTestId, rerender, queryByTestId
    } = render( <UserAvatar
      hasProfilePicture={false}
      isLoading={true}/> )
    expect( getByTestId( "loadingSkeleton" ) ).toBeVisible()
    rerender( <UserAvatar
      hasProfilePicture={false}
      isLoading={false}/> )
    expect( queryByTestId( "loadingSkeleton" ) ).toBeFalsy()

  })

  it( "test if Avatar has style when hasProfilePicture is false", ()=>{
    const { getByTestId, } = render(
      <UserAvatar
        hasProfilePicture={true}
        isLoading={false}/>
    )
    const AvatarComponent = getByTestId( "avatarTest" )
    expect( AvatarComponent ).not.toHaveStyle({})
  })

  it( "test if img element is rendered", ()=>{
    const { getByTestId, } = render(
      <UserAvatar
        hasProfilePicture={true}
        isLoading={false}
        pictureToShow="da"
      />
    )
    const ImgElement = getByTestId( "imgTest" )
    expect( ImgElement ).toBeVisible()
  })

  it( "test if img element has style", ()=>{
    const style = {
      width: '50px',
      height: '50px'
    }
    const {
      getByTestId, rerender
    } = render(
      <UserAvatar
        hasProfilePicture={true}
        isLoading={false}
        pictureToShow="da"
        sx={style}
      />
    )
    const ImgElement = getByTestId( "imgTest" )
    expect( ImgElement ).toHaveStyle( style )
    rerender(
      <UserAvatar
        hasProfilePicture={true}
        pictureToShow="da"
        isLoading={false}
      />
    )
    expect( ImgElement ).not.toHaveStyle( style )
  })

  it( "test img on error", ()=>{
    const style = {
      width: '50px',
      height: '50px'
    }
    const { getByTestId } = render(
      <UserAvatar
        hasProfilePicture={true}
        isLoading={false}
        pictureToShow="da"
        sx={style}
      />
    )
    const ImgElement = getByTestId( "imgTest" )
    fireEvent.error( ImgElement )
    expect( ImgElement ).not.toBeVisible()
  })

})