(function($){
    $(window).load(function(){

        'use strict';

        var form = jQuery('.moedit-textarea').closest('form');

        var textarea = form.find('[name="_content"]');

        var form_data = {
            'module' : 'file',
            'act' : null,
            'editor_sequence' : form.find('input[type="file"]').data('editor-sequence')
        };





        var angular_moedit = angular.module('xe.moedit',['ngSanitize']);

        angular_moedit.controller ('moeditController',['$scope','$http', function($scope, $http){


            $scope.upload_touched = false;


            $scope.moedit_file_list = {};


            $scope.get_file_list = function(callback) {
                $http({
                    'url' : request_uri,
                    'method' : 'post',
                    'responseType' : 'json',
                    'data' : $.param($.extend({}, form_data, {
                        'act': 'getFileList',
                        'filmide_srls': textarea.data('mid')
                    }))})
                    .success(function (data, status, headers, config) {

                        if(data.files.length>0)
                        {
                            $scope.upload_touched = true;
                        }

                        $scope.moedit_file_list = data;
                        if(typeof callback === 'function'){
                            callback();
                        };
                    })
                    .error(function (data, status, headers, config) {
                        // 미구현
                    })

            };





            $scope.delete_file = function(file) {


                file.message = '삭제중입니다.';

                $http({
                    'url' : request_uri,
                    'method' : 'post',
                    'responseType' : 'json',
                    'data' : $.param($.extend({}, form_data, {
                        'act': 'procFileDelete',
                        'file_srls': file.file_srl
                    }))})
                    .success(function (data, status, headers, config) {
                        $scope.get_file_list();
                    })
                    .error(function (data, status, headers, config) {
                        file.message = '삭제를 실패했습니다.';
                        $scope.get_file_list();
                    });
            };





           $scope.isimg = function(file){
                if(file.direct_download !=='Y') return false;
                return /\.(png|jpe?g|gif|bmp|webp)$/i.test(file.download_url);
            };



           $scope.get_file_list(init);


        }]);
        angular.bootstrap(jQuery('.moedit-file-list'),['xe.moedit']);
        var moedit_angular_scope = angular.element(jQuery('.moedit-file-list')).scope();

        autosize($('.mobile-text-editor').find('[name="_content"]'));











        var html_to_textarea = function(html){
            var a = document.createElement('div');
            html = html.replace(/<br\/?>/g,'\r\n');
            window.z=jQuery(a).html(html).text();
            var z = jQuery(a).html(html).text();
            return jQuery(a).html(html).text();

        };

        var is_moedit_textarea_compatible =  function(content)
        {

        // br, p tag 이외에 다른 tag가 존재하지 않으면 통과
            if(/<(?!(br|p))/i.test(content) === false)
            {
                return true;
            }
            else if(/<(?!(br|p|img))/i.test(content) === false)
            {
                var img_src_arr = [];

                var img_arr  = content.match(/<img.*?>/ig);

                var host = jQuery('.mobile-text-editor').data('host');

                return img_arr.every(function(i, idx, arr){
                    var src = i.match(/src=("|')(.*?)\1/);
                    if (typeof src[2] === 'string' && src[2].toLowerCase().indexOf(host) > -1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                });
            }
            return false;
        };



        function init(){


            var init_content = form.find('[name="content"]').val();

            if(is_moedit_textarea_compatible(init_content) === false){
                if(window.confirm("이 글을 모바일에서 수정하면 텍스트 서식이 적용되지 않으며, 일부 사진 등이 누락 될 수 있습니다. 그래도 수정하시겠습니까?") === false)
                {
                    alert('이전 페이지로 이동합니다');
                    window.history.back();
                }
                else
                {
                    init_content = html_to_textarea(init_content);
                    form.find('[name="_content"]').val(init_content);
                    alert('작성한 글을 모바일 에디터에 맞게 변환 했습니다.');
                }
            }
            else {
                // 문제가 없으면 조용히 변환처리.
                init_content = html_to_textarea(init_content);
                form.find('[name="_content"]').val(init_content);
            }




            form.fileupload({
                url: request_uri,
                formData : jQuery.extend(form_data,{'act':'procFileUpload'}),
                dataType: 'json',
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('.mobile-text-editor-file-upload-progress').progressbar('value', progress);
                    $('.mobile-text-editor-file-upload-progress-label').html(progress+'%');
                },
                add : function(e, data){

                    var deferred = jQuery.Deferred();

                    var i;
                    var size=0;

                    for(i=0; i<data.files.length; i++)
                    {
                        size += data.files[i].size;

                    }
                    deferred.resolve();


                    if( moedit_angular_scope.get_file_list.left_size >size)
                    {
                        alert('파일 사이즈가 너무 큽니다');
                        e.cancel();
                        deferred.reject();
                    }
                    deferred.done(function(){
                        moedit_angular_scope.get_file_list.left_size += size;
                        data.submit();
                    });


                },
                beforeSend : function() {
                    console.log('a',arguments);

                    $('.mobile-text-editor-file-upload-progress').slideDown();
                    $('.mobile-text-editor-file-upload-progress-label').html('0%');
                },
                complete : function (){
                    moedit_angular_scope.get_file_list();
                    $('.mobile-text-editor-file-upload-progress').slideUp('500').progressbar('value', 0);
                    $('.mobile-text-editor-file-upload-progress-label').html('업로드 대기중');
                }

            });

            $('.mobile-text-editor-file-upload-progress').progressbar();
            form.find('input[type="file"]').click(function(){
                moedit_angular_scope.upload_touched = true;
                console.log('xxxx');
                jQuery(this).unbind(e);
            })
        }





        var init_type = form.attr('onsubmit').toLowerCase();



        form.unbind('submit').submit(function(e){
            e.preventDefault();

            var content = form.find('[name="_content"]').val();

            var img = '';


            var relative_default_url = window.default_url.replace(/^https?:/,'');

            if(Array.isArray(moedit_angular_scope.moedit_file_list.files)){

                moedit_angular_scope.moedit_file_list.files.forEach(function(i, idx, arr){

                    if(i.direct_download === 'Y' && /(png|jpe?g|gif|bmp|webp)$/i.test(i.download_url))
                    {
                        img += '<img src="' + relative_default_url+ i.download_url+'" alt="'+ i.source_filename+'" data-edit-by="moedit" />&nbsp;<br/>';
                    }
                });
            }


            content = _.escape(content);
            content = content.replace(/\r\n|\r|\n/g,'<br/>');
            content = img+content;
            form.find('[name="content"]').val(content);

            if(init_type.indexOf('procfilter') <0 ){
                alert('ERROR : 지원하지 않는 환경입니다.');
                return;
            }


            if( init_type.indexOf('comment') < 0 )
            {
                procFilter(this, window.insert);

            }
            else
            {
                procFilter(this, insert_comment);
            }

        });












    });
})(jQuery);
















