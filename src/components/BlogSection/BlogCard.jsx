import styled from 'styled-components';
import Image from 'next/image';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'

  export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; 
  height: 500px;
  background-color:#F1F4F6;
  padding-bottom:2rem;
  justify-content: space-evenly;
  @media (max-width: 960px) {
    height:auto;
  }
`;
export const StyledH1 = styled.h1`
  // font-family: 'Saira', sans-serif;
  font-size: 2.5vw;
  // font-size: 32px;
  font-weight: 700;
  line-height: 50.37px;
`;

  export const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap:20px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
  `;

export const CustomCard = styled(Card)`
  // background-color: pink;
  transition: transform 0.3s ease;
  border-radius:3%;
  &:hover {
    transform: scale(1.1);
  }
`;
export const CustomCardHeader = styled(CardHeader)`
  padding:0px;
  
`;
export const CustomCardTitle = styled(CardTitle)`
  // font-family: 'Saira', sans-serif;
  font-size: 1.5vw;
  // font-size: 20px;
  font-weight: 700;
  line-height: 31.48px;
  text-align: left;
  margin:10px;
`;
export const CustomCardDescription = styled(CardDescription)`
  // font-family: 'Saira', sans-serif;
  font-size: 0.8vw;
  // font-size: 14px;
  font-weight: 400;
  line-height: 22.04px;
  text-align: left;
  color: #8E9CA0;
  margin:10px;
`;
export const CustomCardFooter = styled(CardFooter)`
  // font-family: 'Saira', sans-serif;
  font-size: 0.8vw;
  // font-size: 14px;
  font-weight: 400;
  line-height: 22.04px;
  margin-left:10px;
  gap:5px;
  padding-left:0px;
  padding-top:24px;
`;

export const FooterImage = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 50%; 
`;


export default function BlogCard({ title, cardImage, cardDescription, cardFooterText}){
  return(
    <>
       <CustomCard>
        <CustomCardHeader>
          <Image
        src={cardImage} 
        alt="Image"
        width={300} 
        height={300} 
      />
     
          <CustomCardTitle>{title}</CustomCardTitle>
          <CustomCardDescription>{cardDescription}</CustomCardDescription>
        </CustomCardHeader>
    
      

        <CustomCardFooter>
        <FooterImage
        src="/footericon.jpg"
        alt="Footer Icon"
        width={32}
        height={32}
        />
          {cardFooterText}

        </CustomCardFooter>
      </CustomCard>
    </>
  )


}



  

