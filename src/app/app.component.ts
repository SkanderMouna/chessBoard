import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import Constants from "./Constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [` img {
    height: 10px;
    width: 10px;
  }`]
})
export class AppComponent implements OnInit {
  @ViewChild("board_table") board!: ElementRef

  constructor(private readonly render: Renderer2) {
  }

  title = 'WTF';
  elementOnDrag: {
    cell?: number,
    img?: any
  } = {}


  ngAfterViewInit() {
    this.setBoard();

  }

  ngOnInit() {

  }

  async setBoard() {

    let color = "#ECDBBA";
    for (let i = 1; i <= 8; i++) {

      const trElement = this.render.createElement('tr')
      color = color == "#ECDBBA" ? "#2D4263" : "#ECDBBA";
      for (let j = 1; j <= 8; j++) {
        const thElement = this.render.createElement('th')
        color = color == "#ECDBBA" ? "#2D4263" : "#ECDBBA";

        this.render.addClass(thElement, 'item')
        this.render.setStyle(thElement, 'background-color', color)
        const id = `cell${i + "-" + j}`

        this.render.setAttribute(thElement, 'id', id.toString())
        this.render.appendChild(trElement, thElement)
        this.render.listen(thElement, "dragstart", this.onDragStarted);
        this.render.listen(thElement, "dragenter", this.onDragEnter);
        this.render.listen(thElement, "dragleave", this.onDragLeaver);
        this.render.listen(thElement, "dragend", this.onDragEnd);
        this.render.listen(thElement, "dragdrop", this.onDragDrop);
        this.render.listen(thElement, "click", event => this.onClick("irr"))
      }

      this.render.appendChild(this.board.nativeElement, trElement);

    }

    //
    this.addImgToCell("cell1-4", true, "king");
    this.addImgToCell("cell1-5", true, "king");
    this.addImgToCell("cell2-4", true, "pawn");
    this.addImgToCell("cell8-4", false, "king");
    this.addImgToCell("cell7-4", false, "pawn");


//     (<HTMLElement>document.getElementById("cell1-5")).innerHTML = `<img src="assets/img/kingBlack.png " class="item">`;

  }

  onDrop(event: CdkDragDrop<HTMLElement>) {

  }

  addImgToCell(id: string, isBlack = true, type: 'king' | 'pawn') {
    const size = 100;

    const source = () => {
      const root = "assets/img/";
      if (type == "king") {
        if (isBlack) return root + "kingBlack.png"
        else return root + "kingWhite.png"
      } else {
        if (isBlack) return root + "pawnBlack.png"
        else return root + "pawnWhite.png"
      }

    };
    (<HTMLElement>document.getElementById(id)).innerHTML = `<img draggable="true"  src="${source()}"  alt="pawn" style="padding: 5px;width: ${size}%;height: :${size}%;" />`
  }

  onDragStarted(event: any) {
    Constants.elementOnDrag = {
      cell: event.currentTarget.id,
      img: event.target,
      isKing: (event.target as HTMLImageElement).src.includes("king"),
      isPawnWhite: (event.target as HTMLImageElement).src.includes("pawnWhite")

    }

  }

  onDragEnter(event: any) {
    Constants.elementTarget = event.currentTarget.id

  }

  onDragLeaver(event: DragEvent) {
    // console.log("Drag left on ", event.currentTarget)
  }

  onDragEnd(event: DragEvent) {
    const img = Constants.elementOnDrag.img
    const size = 100;
    if (Constants.elementTarget === String(Constants.elementOnDrag.cell)) {
      return
    }
    const target = (<HTMLElement>document.getElementById(String(Constants.elementTarget))).innerHTML;
    if (target != '') return

    if (!Constants.canItMove(Constants.elementOnDrag)) return
    (<HTMLElement>document.getElementById(Constants.elementTarget)).innerHTML = `<img draggable="true"  src="${img?.src}"  alt="pawn" style="padding: 5px;width: ${size}%;height: :${size}%;" />`;
    (<HTMLElement>document.getElementById(String(Constants.elementOnDrag?.cell!))).innerHTML = ``;
    Constants.elementOnDrag = {}
    Constants.elementTarget = ''


  }

  onDragDrop(event: any) {
    console.log("Dropped")
  }

  onClick(id: any) {
    console.log(id)
  }


}



