import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {PositionsService} from '../../../shared/services/positions.service'
import {Position} from '../../../shared/interfaces'
import {MaterialInstance, MaterialService} from '../../../shared/classes/material.service'
import {FormControl, FormControlName, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-positions-forms',
  templateUrl: './positions-forms.component.html',
  styleUrls: ['./positions-forms.component.scss']
})
export class PositionsFormsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef

  positions: Position[]
  loading = false
  modal: MaterialInstance
  form: FormGroup
  positionId = null

  constructor(
    private positionsService: PositionsService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId).subscribe(
      (positions) => {
        this.positions = positions
        this.loading = false
      }
    )
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  onSelectPosition(position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: null,
      cost: null
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: null, cost: null})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition)
        .subscribe(
          position => {
            const idx = this.positions.findIndex(p => p._id === position._id)
            this.positions[idx] = position
            MaterialService.toast('Changes saved')
          },
          error => {
            this.form.enable()
            MaterialService.toast(error.error.message)
          },
          completed
        )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position created')
          this.positions.push(position)
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }

  }

  onDeletePosition(event: Event, position: Position ) {
    event.stopPropagation()
    const decision = confirm(`Are you sure you want to delete a ${position.name} position?`)
    if (decision) {
      this.positionsService.delete(position)
        .subscribe(
          response => {
            const idx = this.positions.findIndex(p => p._id === position._id)
            this.positions.splice(idx, 1)
            MaterialService.toast(response.message)
          },
          error => MaterialService.toast(error.error.message)
        )
    }
  }
}
