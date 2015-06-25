### 개요

XE 에서는 게시판에서 글을 쓸때 PC 버젼이면 에디터를 가져오도록 하나, 모바일 버젼에서는 스킨 자체에서 에디터를 구현하거나, textarea를 사용 할 수밖에 없습니다.
이 경우 스킨에서 따로 모바일 에디터를 만들지 않는 이상 모바일 상에서 파일업로드 등이 불가능합니다.

본 에디터 스킨은 다음과 같은 해결하여 모바일용 게시판 스킨의 제작을 간편하게 처리가 가능하도록 하는것이 목적입니다.





### 이용방법

Moedit을 사용하기 위해서는 2군데를 수정해야 합니다.
1. 현재 사용중인 에디터 감싸기
2. 모바일 게시판에서 에디터를 사용하도록 하기


#### 에디터 감싸기.
1. 게시판에 적용할 에디터를 고릅니다(CKEditor/XpressEditor ....)
2. 해당 에디터 폴더에내 들어가서 editor.html 파일을 다음과 같은 형태로 감싸줍니다.


<!--@if(Mobile::isFromMobilePhone() === true)-->
<!--#include("../moedit/moedit.html"")-->
<!--@else-->

원래 파일의 editor.html 내용을 여기에 그대로 붙여넣으세요

<!--@end-->

```

#### 모바일 게시판에서 moedit을 이용하도록 하기
1. 사용중인 게시판 스킨에서 wirte_form.html comment_form.html 파일을 열어주세요.
2.두 파일 모두  <textarea name="content"></textarea> 부분을 찾아서

다음 2줄로 변경합니다.

```
<input type="hidden" name="content>
{$oDocument->getEditor()}
```

3. PC/모바일 모두 Moedit을 쓰시려면 위와 같은 절차 없이 그냥 사용하시면 됩니다.


#### 구체적인 예시
- 스케치북 스킨의 경우
