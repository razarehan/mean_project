import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private isCreateMode = true;
  private authStatusSub!: Subscription;
  isLoading = false;
  private editedPostId: any;
  post: any;
  userId:string='';
  form!: FormGroup;
  constructor(private postsService: PostsService, 
              private route: ActivatedRoute,
              private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus)=>{
      this.isLoading = false;
    });
    this.userId!= this.authService.getUserId();
    this.form = new FormGroup({
      title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        },),
      content: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)]
        })
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        // spinner start
        this.isLoading = true;
        this.isCreateMode = false;
        this.editedPostId = paramMap.get('postId');
        this.postsService.getPost(this.editedPostId).subscribe(postData => {
          // spinner stop 
          setTimeout(() => {
            this.isLoading = false;
            this.post = { id: postData.post._id, title: postData.post.title, content: postData.post.content };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content
            })
          }, 1000);
        }) 
      }
      else {
        this.isCreateMode = true;
        this.editedPostId = null;
      }
    }); 
  }


  onSavePost() {
    if(this.form.invalid)  return;
    this.isLoading = true;
    if(this.isCreateMode) {
      const post: Post = this.form.value;
      this.postsService.addPosts({id: '', title: post.title, content: post.content, creator:this.userId});
    }
    else {
      this.postsService.updatePost(this.post.id, this.form.value.title, this.form.value.content, this.userId);
    }
    this.form.reset();
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
