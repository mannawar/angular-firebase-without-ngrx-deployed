import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f') slform: NgForm;
  subscription: Subscription
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex= index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.slform.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    })
  }

  onSubmit(form: NgForm) {
    const value = form.value
    console.log(value)
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    }
    else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode=false;
    form.reset();
  }

  onClear(){
    this.editMode= false;
    this.slform.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
